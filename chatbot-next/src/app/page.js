// App.jsx
import CustomerSupportWidget from '../components/CustomerSupportWidget.jsx'
// !FIX! import './App.css'
import '../components/CustomerSupportWidget.css'
import '../components/FileInput.css'
import '../components/TextInput.css'
import '../components/Chat.css'

function App() {

  return (
    <>
      <div className="customer-support-widget-container">
        <CustomerSupportWidget />
      </div>
    </>
  )
}

export default App
