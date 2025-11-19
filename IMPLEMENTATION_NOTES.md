# Implementation Notes

## Custom FormKit Input: International Telephone Input

This document provides technical details about the implementation of the `tel-intl` custom FormKit input.

## Architecture Overview

### Component Structure

```
tel-intl input
├── tel-intl.js (FormKit Input Definition)
│   ├── Uses createInput() API
│   ├── Defines props: ['options', 'telInputOptions']
│   ├── Adds custom validation feature
│   └── Exports FormKit-compatible input
│
└── TelIntlInputWrapper.vue (Vue Component)
    ├── Integrates intl-tel-input-vue
    ├── Manages value synchronization
    ├── Handles validation state
    └── Provides event handlers
```

## Key Implementation Details

### 1. FormKit Integration (`tel-intl.js`)

```javascript
export default createInput(TelIntlInputWrapper, {
  props: ['options', 'telInputOptions'],
  features: [addPhoneValidation]
})
```

**Why this approach:**
- `createInput()` is FormKit's official API for custom inputs
- Accepts a Vue component as the first argument
- Props array defines which props can be passed to the input
- Features array allows adding custom validation logic

### 2. Value Binding Strategy

**Problem:** Need bidirectional sync between intl-tel-input and FormKit

**Solution:**
```javascript
// FormKit → Component (external changes)
watch(() => props.context.value, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue || ''
  }
})

// Component → FormKit (user input)
const handleChange = (event) => {
  const iti = telInputRef.value?.getInstance()
  const fullNumber = iti.getNumber()
  props.context.node.input(fullNumber)  // Update FormKit
  localValue.value = fullNumber          // Update local state
}
```

**Key Points:**
- `context.node.input()` is the official way to update FormKit's value
- Local state (`localValue`) is needed for v-model binding with intl-tel-input
- Watch ensures external changes (form reset, hydration) are reflected

### 3. Validation Integration

**Two-layer validation:**

1. **intl-tel-input validation** (built-in)
   ```javascript
   const isValid = iti.isValidNumber()
   props.context.isValidPhone = isValid
   ```

2. **FormKit validation** (custom feature)
   ```javascript
   node.on('input', ({ payload }) => {
     if (payload && !node.context.isValidPhone) {
       node.setErrors(['Please enter a valid phone number'])
     } else {
       node.clearErrors()
     }
   })
   ```

**Why both:**
- intl-tel-input provides phone-specific validation
- FormKit's validation system displays errors in the UI
- Storing `isValidPhone` in context bridges the two systems

### 4. Event Handling

**Events handled:**
- `onChange` - User types in the input
- `onBlur` - Input loses focus (triggers FormKit blur validation)
- `onCountryChange` - User selects different country
- `onValidate` - intl-tel-input validation state changes

**Event flow:**
```
User Action
    ↓
intl-tel-input event
    ↓
Handler function
    ↓
├─→ Update validation state (context.isValidPhone)
├─→ Get full international number
└─→ Update FormKit value (context.node.input())
```

### 5. Options Merging

```javascript
const telInputConfig = computed(() => {
  const defaultOptions = { /* sensible defaults */ }
  const userOptions = props.context.options || props.context.telInputOptions || {}
  return { ...defaultOptions, ...userOptions }
})
```

**Strategy:**
- Provide sensible defaults for common use cases
- Allow users to override any option
- Support both `options` and `telInputOptions` prop names for flexibility

### 6. Styling Approach

**Three-layer styling:**

1. **intl-tel-input base styles** (imported CSS)
   ```javascript
   import 'intl-tel-input/build/css/intlTelInput.css'
   ```

2. **FormKit-compatible styles** (scoped CSS)
   - Match FormKit's input styling
   - Proper focus states
   - Error state styling

3. **Deep selectors for dropdown** (`:deep()`)
   ```css
   .formkit-tel-intl-wrapper :deep(.iti__country-list) {
     /* Custom dropdown styles */
   }
   ```

**Why deep selectors:**
- intl-tel-input renders elements outside component scope
- Need to style dropdown, flags, and country list
- `:deep()` is Vue 3's way to pierce scoped styles

## Design Decisions

### 1. Always Return International Format

**Decision:** Always return full international number (e.g., `+14155552671`)

**Rationale:**
- Unambiguous format for storage
- Works internationally without context
- Easy to parse and validate server-side
- Consistent with best practices

**Implementation:**
```javascript
const fullNumber = iti.getNumber()  // Returns +xxxx format
props.context.node.input(fullNumber)
```

### 2. Automatic Country Detection

**Decision:** Default to `initialCountry: 'auto'` with IP geolocation

**Rationale:**
- Better UX - users don't need to select their country
- Reduces friction in forms
- Fallback to 'us' if detection fails

**Implementation:**
```javascript
geoIpLookup: (callback) => {
  fetch('https://ipapi.co/json')
    .then((res) => res.json())
    .then((data) => callback(data.country_code))
    .catch(() => callback('us'))
}
```

### 3. Validation on Input

**Decision:** Validate on every input change, not just on blur

**Rationale:**
- Immediate feedback improves UX
- Users know if number is valid as they type
- Prevents form submission with invalid data

**Trade-off:** More aggressive validation might feel intrusive for some users

### 4. Separate Component Files

**Decision:** Split into `tel-intl.js` (definition) and `TelIntlInputWrapper.vue` (component)

**Rationale:**
- Clear separation of concerns
- FormKit definition separate from Vue implementation
- Easier to maintain and test
- Follows FormKit's recommended pattern

## Common Patterns

### Adding Custom Validation Rules

```javascript
<FormKit
  type="tel-intl"
  name="phone"
  validation="required|matches:/^\+[1-9]\d{1,14}$/"
  :validation-messages="{
    matches: 'Please enter a valid international phone number'
  }"
/>
```

### Accessing the intl-tel-input Instance

If you need direct access to the intl-tel-input instance:

```javascript
// In TelIntlInputWrapper.vue
const iti = telInputRef.value?.getInstance()

// Available methods:
iti.getNumber()           // Get full international number
iti.isValidNumber()       // Check if valid
iti.getSelectedCountryData()  // Get country info
iti.setCountry('us')      // Programmatically set country
```

### Handling Form Reset

FormKit automatically handles form reset. The watch on `context.value` ensures the component updates:

```javascript
watch(() => props.context.value, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue || ''
  }
})
```

## Performance Considerations

### 1. CDN Resources

**Current approach:** Load utils script from CDN
```javascript
utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.0/build/js/utils.js'
```

**Pros:**
- No bundle size increase
- Cached across sites
- Always up to date

**Cons:**
- Requires internet connection
- Slight delay on first load

**Alternative:** Bundle the utils script locally for offline support

### 2. Country Data

intl-tel-input includes data for all countries (~200KB). This is loaded on demand when the dropdown is opened.

**Optimization options:**
- Use `onlyCountries` to limit available countries
- Use `excludeCountries` to remove unused countries

```javascript
<FormKit
  type="tel-intl"
  :options="{
    onlyCountries: ['us', 'ca', 'gb', 'au'],
  }"
/>
```

### 3. Geolocation API

**Current:** Uses ipapi.co (free tier: 1000 requests/day)

**For production:**
- Cache the result in localStorage
- Use your own geolocation service
- Or set a default country without auto-detection

## Testing Recommendations

### Unit Tests

Test the component in isolation:

```javascript
import { mount } from '@vue/test-utils'
import TelIntlInputWrapper from './TelIntlInputWrapper.vue'

describe('TelIntlInputWrapper', () => {
  it('updates FormKit value on input', async () => {
    const mockContext = {
      node: { input: vi.fn() },
      value: '',
      // ... other context props
    }
    
    const wrapper = mount(TelIntlInputWrapper, {
      props: { context: mockContext }
    })
    
    // Simulate input
    await wrapper.find('input').setValue('+14155552671')
    
    expect(mockContext.node.input).toHaveBeenCalledWith('+14155552671')
  })
})
```

### Integration Tests

Test within a FormKit form:

```javascript
import { mount } from '@vue/test-utils'
import { plugin, defaultConfig } from '@formkit/vue'
import telIntl from './tel-intl'

const wrapper = mount(TestForm, {
  global: {
    plugins: [
      [plugin, defaultConfig({
        inputs: { 'tel-intl': telIntl }
      })]
    ]
  }
})
```

### E2E Tests

Test the complete user flow:

```javascript
// Using Playwright or Cypress
test('submits form with phone number', async ({ page }) => {
  await page.goto('/form')
  
  // Select country
  await page.click('.iti__selected-flag')
  await page.click('[data-country-code="us"]')
  
  // Enter phone number
  await page.fill('input[type="tel"]', '4155552671')
  
  // Submit form
  await page.click('button[type="submit"]')
  
  // Verify submission
  await expect(page.locator('.result')).toContainText('+14155552671')
})
```

## Troubleshooting Guide

### Issue: Value not updating

**Check:**
1. Is `context.node.input()` being called?
2. Is the component inside a `<FormKit type="form">`?
3. Are there console errors?

**Debug:**
```javascript
const handleChange = (event) => {
  const fullNumber = iti.getNumber()
  console.log('Updating FormKit value:', fullNumber)
  props.context.node.input(fullNumber)
}
```

### Issue: Validation not working

**Check:**
1. Is the utils script loading? (Check Network tab)
2. Is `isValidPhone` being set correctly?
3. Are validation rules properly defined?

**Debug:**
```javascript
const handleValidate = (isValid) => {
  console.log('Validation state:', isValid)
  props.context.isValidPhone = isValid
}
```

### Issue: Styles not applying

**Check:**
1. Is the CSS imported? (`import 'intl-tel-input/build/css/intlTelInput.css'`)
2. Are there conflicting global styles?
3. Is the component rendering correctly?

**Debug:** Use browser DevTools to inspect the rendered HTML and applied styles

## Future Enhancements

Potential improvements for future versions:

1. **Offline Support**
   - Bundle utils script locally
   - Cache country data

2. **Accessibility**
   - Add ARIA labels
   - Improve keyboard navigation
   - Screen reader support

3. **Advanced Validation**
   - Custom validation rules
   - Server-side validation integration
   - Real-time carrier lookup

4. **Performance**
   - Lazy load country data
   - Virtual scrolling for country list
   - Debounce validation

5. **Features**
   - SMS verification integration
   - Phone number formatting options
   - Multiple number support

## References

- [FormKit Custom Inputs Documentation](https://formkit.com/essentials/custom-inputs)
- [intl-tel-input Documentation](https://github.com/jackocnr/intl-tel-input)
- [intl-tel-input-vue Package](https://www.npmjs.com/package/intl-tel-input-vue)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
