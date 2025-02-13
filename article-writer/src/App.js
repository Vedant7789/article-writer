import { useState } from "react";
import axios from "axios";

export default function App() {
    const [title, setTitle] = useState("");
    const [essay, setEssay] = useState("");
    const [optimizedEssay, setOptimizedEssay] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to generate essay
    const generateEssay = async () => {
        if (!title) return alert("Please enter a title.");
        setLoading(true);
        setOptimizedEssay("");

        try {
            const res = await axios.post("http://localhost:5000/generate-essay", { title });
            setEssay(res.data.essay);
        } catch (error) {
            alert("Failed to generate essay.");
        } finally {
            setLoading(false);
        }
    };

    // Function to optimize essay
    const optimizeEssay = async () => {
        if (!essay) return alert("Generate an essay first.");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/optimize-essay", { essay });
            setOptimizedEssay(res.data.optimizedEssay);
        } catch (error) {
            alert("Failed to optimize essay.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">ARTICLE WRITER</h1>

            <input 
                type="text" 
                className="w-full p-2 border rounded mb-4" 
                placeholder="Enter article title..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
            />

            <button 
                className="px-4 py-2 bg-blue-500 text-white rounded" 
                onClick={generateEssay}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Article"}
            </button>

            {essay && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Generated Article</h2>
                    <textarea 
                        className="w-full p-2 border rounded mt-2 h-40" 
                        value={essay} 
                        readOnly
                    ></textarea>

                    <button 
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded" 
                        onClick={optimizeEssay}
                        disabled={loading}
                    >
                        {loading ? "Optimizing..." : "Optimize Article"}
                    </button>
                </div>
            )}

            {optimizedEssay && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Optimized Article</h2>
                    <textarea 
                        className="w-full p-2 border rounded mt-2 h-40" 
                        value={optimizedEssay} 
                        readOnly
                    ></textarea>
                </div>
            )}
        </div>
    );
}