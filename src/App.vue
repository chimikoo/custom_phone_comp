<template>
  <div id="app">
    <div class="container">
      <header>
        <h1>📞 FormKit International Tel Input</h1>
        <p class="subtitle">Custom FormKit input component with intl-tel-input integration</p>
      </header>

      <div class="demo-section">
        <h2>Demo Form</h2>
        
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="true"
          submit-label="Submit Form"
        >
          <FormKit
            type="text"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            validation="required"
            help="Enter your full name"
          />

          <FormKit
            type="email"
            name="email"
            label="Email Address"
            placeholder="john@example.com"
            validation="required|email"
          />

          <FormKit
            type="telIntl"
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            validation="required"
            help="Enter your phone number with country code"
          />

          <FormKit
            type="telIntl"
            name="alternatePhone"
            label="Alternate Phone (Optional)"
            placeholder="Enter alternate phone"
            :options="{
              initialCountry: 'gb',
              preferredCountries: ['gb', 'us', 'ca'],
              autoPlaceholder: 'aggressive'
            }"
          />
        </FormKit>
      </div>

      <div class="demo-section" v-if="submittedData">
        <h2>Submitted Data</h2>
        <div class="result-box">
          <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h2>Features</h2>
        <ul class="features-list">
          <li>✅ Full FormKit integration with validation</li>
          <li>✅ International phone number formatting</li>
          <li>✅ Country flag dropdown</li>
          <li>✅ Automatic country detection</li>
          <li>✅ Real-time validation</li>
          <li>✅ Returns full international number (+xxxx)</li>
          <li>✅ Customizable options via props</li>
          <li>✅ FormKit theme compatibility</li>
        </ul>
      </div>

      <div class="demo-section">
        <h2>Usage Examples</h2>
        
        <div class="code-example">
          <h3>Basic Usage</h3>
          <pre><code>&lt;FormKit
  type="telIntl"
  name="phone"
  label="Phone Number"
  validation="required"
  placeholder="Enter your phone number"
/&gt;</code></pre>
        </div>

        <div class="code-example">
          <h3>With Custom Options</h3>
          <pre><code>&lt;FormKit
  type="telIntl"
  name="phone"
  label="Phone Number"
  :options="{
    initialCountry: 'us',
    preferredCountries: ['us', 'gb', 'ca'],
    autoInsertDialCode: true,
    formatOnDisplay: true
  }"
/&gt;</code></pre>
        </div>

        <div class="code-example">
          <h3>Installation</h3>
          <pre><code>// main.js
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
  .mount('#app')</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const submittedData = ref(null)

const handleSubmit = (data) => {
  console.log('Form submitted:', data)
  submittedData.value = data
  
  // Show success message
  alert('Form submitted successfully! Check the console and the "Submitted Data" section below.')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
}

#app {
  max-width: 100%;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
}

.demo-section {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.demo-section:last-child {
  border-bottom: none;
}

.demo-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-weight: 600;
}

.result-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  overflow-x: auto;
}

.result-box pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #374151;
}

.features-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.features-list li {
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #166534;
}

.code-example {
  margin-bottom: 2rem;
}

.code-example:last-child {
  margin-bottom: 0;
}

.code-example h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #374151;
  font-weight: 600;
}

.code-example pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.code-example code {
  font-family: 'Courier New', monospace;
}

/* FormKit custom styling */
.formkit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Responsive design */
@media (max-width: 768px) {
  body {
    padding: 1rem;
  }

  header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .demo-section {
    padding: 1.5rem;
  }

  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
