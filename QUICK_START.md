# Quick Start Guide

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the demo.

## Usage in Your Project

### 1. Copy Files

Copy these files to your project:
```
src/inputs/
  ├── tel-intl.js
  └── TelIntlInputWrapper.vue
```

### 2. Install Dependencies

```bash
npm install @formkit/vue @formkit/themes @formkit/inputs intl-tel-input
```

### 3. Register the Input

In your `main.js`:

```javascript
import { createApp } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import telIntl from './inputs/tel-intl'

createApp(App)
  .use(plugin, defaultConfig({
    inputs: {
      'tel-intl': telIntl
    }
  }))
  .mount('#app')
```

### 4. Use in Forms

```vue
<FormKit
  type="tel-intl"
  name="phone"
  label="Phone Number"
  validation="required"
  placeholder="Enter your phone number"
/>
```

## Common Examples

### Basic Phone Input
```vue
<FormKit
  type="tel-intl"
  name="phone"
  label="Phone Number"
  validation="required"
/>
```

### With Custom Country
```vue
<FormKit
  type="tel-intl"
  name="phone"
  label="Phone Number"
  :options="{
    initialCountry: 'gb',
    preferredCountries: ['gb', 'us', 'ca']
  }"
/>
```

### Optional Phone Field
```vue
<FormKit
  type="tel-intl"
  name="alternatePhone"
  label="Alternate Phone (Optional)"
/>
```

### In a Complete Form
```vue
<template>
  <FormKit type="form" @submit="handleSubmit">
    <FormKit
      type="text"
      name="name"
      label="Name"
      validation="required"
    />
    
    <FormKit
      type="tel-intl"
      name="phone"
      label="Phone"
      validation="required"
    />
  </FormKit>
</template>

<script setup>
const handleSubmit = (data) => {
  console.log(data)
  // data.phone will be in format: "+14155552671"
}
</script>
```

## Available Options

Pass any [intl-tel-input options](https://github.com/jackocnr/intl-tel-input#options) via the `options` prop:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialCountry` | String | `"auto"` | Initial country (ISO code or "auto") |
| `preferredCountries` | Array | `[]` | Countries at top of list |
| `separateDialCode` | Boolean | `false` | Show dial code separately |
| `formatOnDisplay` | Boolean | `true` | Format as user types |
| `autoPlaceholder` | String | `"polite"` | Placeholder behavior |

## Output Format

The input always returns the full international phone number:

```javascript
{
  phone: "+14155552671",  // US number
  mobile: "+447911123456" // UK number
}
```

## Troubleshooting

### Input not appearing
- Check that you've registered the input in `main.js`
- Verify `@formkit/inputs` is installed

### Validation not working
- Ensure the utils script is loading (check Network tab)
- The component uses automatic geolocation via ipapi.co

### Styles missing
- The CSS is imported automatically in `TelIntlInputWrapper.vue`
- Make sure `intl-tel-input` package is installed

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) for technical details
- Customize the styling in `TelIntlInputWrapper.vue`
