# FormKit International Telephone Input

A custom FormKit input component that integrates the `intl-tel-input` Vue component for international phone number input with full FormKit validation and form submission support.

## Features

- ✅ **Full FormKit Integration** - Works seamlessly with FormKit's validation, form submission, and value hydration
- ✅ **International Phone Formatting** - Automatic formatting based on country
- ✅ **Country Flag Dropdown** - Visual country selection with flags
- ✅ **Automatic Country Detection** - Uses IP geolocation to detect user's country
- ✅ **Real-time Validation** - Validates phone numbers as user types
- ✅ **Full International Number** - Returns complete number with country code (e.g., +46701234567)
- ✅ **Customizable Options** - Pass any intl-tel-input options through FormKit props
- ✅ **FormKit Theme Compatible** - Inherits FormKit's styling and error display

## Installation

### 1. Install Dependencies

```bash
npm install vue @formkit/vue @formkit/themes intl-tel-input intl-tel-input-vue
```

### 2. Copy the Custom Input Files

Copy the following files to your project:

```
src/
  inputs/
    tel-intl.js
    TelIntlInputWrapper.vue
```

### 3. Register the Input

In your `main.js`:

```javascript
import { createApp } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import App from './App.vue'
import telIntl from './inputs/tel-intl'

const app = createApp(App)

app.use(plugin, defaultConfig({
  inputs: {
    'tel-intl': telIntl
  }
}))

app.mount('#app')
```

## Usage

### Basic Usage

```vue
<FormKit
  type="tel-intl"
  name="phone"
  label="Phone Number"
  validation="required"
  placeholder="Enter your phone number"
/>
```

### With Custom Options

You can pass any `intl-tel-input` options through the `options` prop:

```vue
<FormKit
  type="tel-intl"
  name="phone"
  label="Phone Number"
  :options="{
    initialCountry: 'us',
    preferredCountries: ['us', 'gb', 'ca'],
    autoInsertDialCode: true,
    formatOnDisplay: true,
    separateDialCode: true
  }"
/>
```

### In a Complete Form

```vue
<template>
  <FormKit
    type="form"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      name="name"
      label="Full Name"
      validation="required"
    />

    <FormKit
      type="tel-intl"
      name="phone"
      label="Phone Number"
      validation="required"
      help="Enter your phone number with country code"
    />

    <FormKit
      type="tel-intl"
      name="alternatePhone"
      label="Alternate Phone (Optional)"
      :options="{
        initialCountry: 'gb',
        preferredCountries: ['gb', 'us', 'ca']
      }"
    />
  </FormKit>
</template>

<script setup>
const handleSubmit = (data) => {
  console.log('Form data:', data)
  // data.phone will contain the full international number, e.g., "+14155552671"
}
</script>
```

## API Reference

### FormKit Props

| Prop | Type | Description |
|------|------|-------------|
| `type` | String | Must be `"tel-intl"` |
| `name` | String | Form field name |
| `label` | String | Field label |
| `placeholder` | String | Input placeholder text |
| `validation` | String | FormKit validation rules (e.g., `"required"`) |
| `help` | String | Help text displayed below the input |
| `disabled` | Boolean | Disables the input |
| `options` | Object | intl-tel-input configuration options |

### intl-tel-input Options

The `options` prop accepts any configuration from [intl-tel-input documentation](https://github.com/jackocnr/intl-tel-input). Common options include:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialCountry` | String | `"auto"` | Initial country selection (ISO 2-letter code or "auto") |
| `preferredCountries` | Array | `[]` | Countries to appear at the top of the list |
| `autoPlaceholder` | String | `"polite"` | Placeholder behavior: "off", "polite", "aggressive" |
| `separateDialCode` | Boolean | `false` | Display the country dial code separately |
| `formatOnDisplay` | Boolean | `true` | Format the number as the user types |
| `nationalMode` | Boolean | `false` | Format in national format instead of international |
| `autoInsertDialCode` | Boolean | `false` | Automatically insert the dial code |

### Default Options

The component comes with sensible defaults:

```javascript
{
  initialCountry: 'auto',
  geoIpLookup: (callback) => {
    fetch('https://ipapi.co/json')
      .then((res) => res.json())
      .then((data) => callback(data.country_code))
      .catch(() => callback('us'))
  },
  utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.0/build/js/utils.js',
  strictMode: true,
  formatOnDisplay: true,
  separateDialCode: false,
  autoPlaceholder: 'polite',
  nationalMode: false
}
```

## Value Format

The component always returns the **full international phone number** including the country code:

```javascript
// Example submitted values:
{
  phone: "+14155552671",      // US number
  alternatePhone: "+447911123456"  // UK number
}
```

## Validation

### Built-in Phone Validation

The component automatically validates phone numbers using intl-tel-input's validation:

```vue
<FormKit
  type="tel-intl"
  name="phone"
  validation="required"
/>
```

### FormKit Validation Rules

You can combine with any FormKit validation rules:

```vue
<FormKit
  type="tel-intl"
  name="phone"
  validation="required|length:10,16"
  :validation-messages="{
    required: 'Phone number is required',
    length: 'Phone number must be between 10 and 16 digits'
  }"
/>
```

## Styling

The component inherits FormKit's styling and includes custom styles for the intl-tel-input dropdown. You can customize the appearance by:

1. **Using FormKit's theme system**
2. **Overriding CSS classes** in your global styles
3. **Modifying the component's scoped styles** in `TelIntlInputWrapper.vue`

### Custom Styling Example

```css
/* Override input styles */
.formkit-tel-intl-wrapper :deep(.iti__tel-input) {
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  padding: 1rem;
}

/* Override dropdown styles */
.formkit-tel-intl-wrapper :deep(.iti__country-list) {
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
```

## Technical Details

### Component Architecture

The implementation consists of two main files:

1. **`tel-intl.js`** - FormKit input definition using `createInput()`
   - Registers the component with FormKit
   - Adds custom validation features
   - Manages FormKit node integration

2. **`TelIntlInputWrapper.vue`** - Vue component wrapper
   - Integrates intl-tel-input Vue component
   - Handles value binding and events
   - Manages validation state
   - Provides styling

### Event Handling

The component listens to and handles:

- `onChange` - Updates FormKit value when user types
- `onBlur` - Triggers FormKit blur validation
- `onCountryChange` - Updates value when country changes
- `onValidate` - Updates validation state

### Value Synchronization

- **User Input → FormKit**: Uses `context.node.input()` to update FormKit's internal value
- **FormKit → Component**: Watches `context.value` for external changes (e.g., form reset)
- **Validation State**: Stored in `context.isValidPhone` for custom validation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses Fetch API for geolocation (with fallback)

## Troubleshooting

### Phone number not validating

Make sure the `utilsScript` is loaded. The component includes it by default via CDN:

```javascript
utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.0/build/js/utils.js'
```

### Country detection not working

The default geolocation uses `ipapi.co`. If it's blocked, provide a custom `geoIpLookup`:

```vue
<FormKit
  type="tel-intl"
  name="phone"
  :options="{
    initialCountry: 'us',  // Fallback country
    geoIpLookup: (callback) => {
      // Your custom geolocation logic
      callback('us')
    }
  }"
/>
```

### Styles not appearing

Make sure you're importing the intl-tel-input CSS. It's included in `TelIntlInputWrapper.vue`:

```javascript
import 'intl-tel-input/build/css/intlTelInput.css'
```

### Value not updating in form

Ensure you're using the component within a `<FormKit type="form">` wrapper and accessing the value through the form's submit handler.

## Development

### Running the Demo

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
custom_phone_comp/
├── src/
│   ├── inputs/
│   │   ├── tel-intl.js              # FormKit input definition
│   │   └── TelIntlInputWrapper.vue  # Vue wrapper component
│   ├── App.vue                      # Demo application
│   └── main.js                      # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Credits

- Built with [FormKit](https://formkit.com/)
- Uses [intl-tel-input](https://github.com/jackocnr/intl-tel-input)
- Vue 3 integration via [intl-tel-input-vue](https://www.npmjs.com/package/intl-tel-input-vue)
