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
      node.on('created', () => {
        if (!node.context.isValidPhone) {
          node.context.isValidPhone = false
        }
      })

      node.on('input', ({ payload }) => {
        const shouldValidate = node.context.attrs?.['validate-phone'] !== false
        
        if (shouldValidate && payload) {
          if (!node.context.isValidPhone) {
            node.setErrors(['Please enter a valid phone number'], true)
          }
        }
      })
      
      node.on('prop:isValidPhone', ({ payload }) => {
        if (payload === true) {
          node.clearErrors(true)
        }
      })
    }
  ]
}

export default telIntlDefinition
