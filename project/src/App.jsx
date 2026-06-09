import { Route } from "react-router-dom";
import { Profilo } from "./pages/Profilo";

const App = () => {
  return(
   <div>
     <div>
        <nav >
          <Route path="/profilo" element= {<Profilo />}> Profilo </Route>
        </nav>
     </div>

     <div></div>
   </div>
  )
}

export default App;