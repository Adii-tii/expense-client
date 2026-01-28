import './App.css'
import './components/accordion'

export default function App(){
  return(
    <div className='container mt-5'>
      <button className='btn btn-primary'>
        Bootstrap working!
      </button>
      <Accordion></Accordion>
    </div>
  )
}