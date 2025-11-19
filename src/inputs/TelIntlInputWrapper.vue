<template>
  <div class="formkit-tel-intl-wrapper">
    <input
      ref="telInputRef"
      type="tel"
      :class="context.classes.input"
      :disabled="context.disabled"
      :placeholder="context.attrs.placeholder || 'Enter phone number'"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'

const props = defineProps({
  context: {
    type: Object,
    required: true
  }
})

const telInputRef = ref(null)
let iti = null

// Merge default options with user-provided options
const telInputConfig = computed(() => {
  const defaultOptions = {
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

  // Merge with user options from props
  const userOptions = props.context.options || props.context.telInputOptions || {}
  
  return {
    ...defaultOptions,
    ...userOptions
  }
})

// Initialize intl-tel-input
onMounted(() => {
  if (telInputRef.value) {
    iti = intlTelInput(telInputRef.value, telInputConfig.value)
    
    // Set initial value if provided
    if (props.context.value) {
      telInputRef.value.value = props.context.value
    }
    
    // Listen to country change
    telInputRef.value.addEventListener('countrychange', handleCountryChange)
  }
})

// Cleanup
onBeforeUnmount(() => {
  if (iti) {
    iti.destroy()
  }
})

// Watch for external value changes (e.g., form reset)
watch(() => props.context.value, (newValue) => {
  if (telInputRef.value && newValue !== telInputRef.value.value) {
    telInputRef.value.value = newValue || ''
  }
})

// Handle input change
const handleInput = (event) => {
  if (iti) {
    // Get the full international number
    const fullNumber = iti.getNumber()
    const isValid = iti.isValidNumber()
    
    // Update FormKit context
    props.context.isValidPhone = isValid
    
    // Update FormKit node value
    props.context.node.input(fullNumber)
  }
}

// Handle blur event
const handleBlur = (event) => {
  if (iti) {
    const fullNumber = iti.getNumber()
    const isValid = iti.isValidNumber()
    
    props.context.isValidPhone = isValid
    props.context.node.input(fullNumber)
    
    // Trigger FormKit blur handler
    if (props.context.handlers.blur) {
      props.context.handlers.blur(event)
    }
  }
}

// Handle country change
const handleCountryChange = () => {
  if (iti) {
    const fullNumber = iti.getNumber()
    const isValid = iti.isValidNumber()
    
    props.context.isValidPhone = isValid
    
    // Only update if there's a number
    if (fullNumber) {
      props.context.node.input(fullNumber)
    }
  }
}
</script>

<style scoped>
.formkit-tel-intl-wrapper {
  width: 100%;
}

/* Ensure the intl-tel-input integrates with FormKit styles */
.formkit-tel-intl-wrapper :deep(.iti) {
  width: 100%;
  display: block;
}

.formkit-tel-intl-wrapper :deep(.iti__tel-input) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.formkit-tel-intl-wrapper :deep(.iti__tel-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.formkit-tel-intl-wrapper :deep(.iti__tel-input:disabled) {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Error state styling */
.formkit-tel-intl-wrapper :deep(.iti__tel-input[aria-invalid="true"]) {
  border-color: #ef4444;
}

.formkit-tel-intl-wrapper :deep(.iti__tel-input[aria-invalid="true"]:focus) {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Country dropdown styling */
.formkit-tel-intl-wrapper :deep(.iti__country-list) {
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-height: 200px;
  overflow-y: auto;
}

.formkit-tel-intl-wrapper :deep(.iti__country) {
  padding: 0.5rem 1rem;
}

.formkit-tel-intl-wrapper :deep(.iti__country:hover) {
  background-color: #f3f4f6;
}

.formkit-tel-intl-wrapper :deep(.iti__country.iti__highlight) {
  background-color: #3b82f6;
  color: white;
}
</style>
