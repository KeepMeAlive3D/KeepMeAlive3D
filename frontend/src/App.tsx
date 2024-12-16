import './App.css'
import Edit from "@/scene/Edit.tsx";

function App({model}: { model: string | null }) {
    return (
        <div className={"main-body"}>
            <main className={"main-content"}>
                <Edit modelUri={model}></Edit>
            </main>
        </div>
    )
}

export default App
