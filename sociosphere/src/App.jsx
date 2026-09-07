import Landing from "./pages/public/Landing";

// Viewing portal for the citizen Report page:
import Report from "./pages/citizen/Report";

// import Home from "./pages/citizen/Home";
import ReportCrime from "./pages/citizen/ReportCrime"

function App() {
  // return <Landing />;
  // To preview Report, comment the line above and uncomment:
  // return <Report />;
  return <ReportCrime/>;
  // return <Home/>
}

export default App;