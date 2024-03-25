import SearchBar from "./components/SeachBar"

function App() {

    return (
        <div className="w-screen h-screen bg-slate-500 flex items-center flex-col">
              <h1 className="text-4xl font-bold my-12">What did you just watch?</h1>
              <SearchBar />
        </div>
    )
  }

export default App
