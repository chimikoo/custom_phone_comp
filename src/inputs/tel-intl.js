import { outer, inner, wrapper, label, help, messages, icon } from '@formkit/inputs'
import TelIntlInputWrapper from './TelIntlInputWrapper.vue'

/**
 * Custom FormKit input for international telephone numbers
 * Uses intl-tel-input library
 */

// Define the input schema
const telIntlSchema = outer(
  wrapper(
    label('$label'),
    inner(
      icon('prefix', 'label'),
      {
        $cmp: 'TelIntlInputWrapper',
        props: {
          context: '$node.context'
        }
      },
      icon('suffix')
    )
  ),
  help('$help'),
  messages()
)

// Define and export the input definition
const telIntlDefinition = {
  schema: telIntlSchema,
  type: 'input',
  family: 'text',
  library: {
    TelIntlInputWrapper
  },
  props: ['options', 'telInputOptions'],
  features: [
    function addPhoneValidation(node) {
      // Initialize validation state
      node.on('created', () => {
        node.context.isValidPhone = false
      })

      // Add custom validation logic that runs during form validation
      node.on('commit', ({ payload }) => {
        // Check if validation is required
        const isRequired = node.props.validation?.includes('required')
        const shouldValidate = node.context.attrs?.['validate-phone'] !== false
        
        if (shouldValidate) {
          // If field is required and empty
          if (isRequired && (!payload || payload === '')) {
            node.setErrors(['This field is required'], true)
            return false
          }
          
          // If there's a value, check if it's valid
          if (payload && payload !== '') {
            // Check for all zeros pattern
            if (payload.match(/^[\+\s\-\(\)]*0+$/)) {
              node.setErrors(['Please enter a valid phone number'], true)
              return false
            }
            
            // Check intl-tel-input validation state
            if (!node.context.isValidPhone) {
              node.setErrors(['Please enter a valid phone number'], true)
              return false
            }
          }
        }
        
        // Clear errors if valid
        node.clearErrors(true)
        return true
      })
      
      // Clear errors when phone becomes valid
      node.on('prop:isValidPhone', ({ payload }) => {
        if (payload === true && node.value && node.value !== '') {
          node.clearErrors(true)
        }
      })
    }
  ]
}

export default telIntlDefinition
