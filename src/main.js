import { createApp } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import App from './App.vue'
import telIntl from './inputs/tel-intl'

const app = createApp(App)

// Register FormKit with custom tel-intl input
const config = defaultConfig({
  inputs: {
    telIntl: telIntl
  }
})

app.use(plugin, config)

app.mount('#app')
