export default function MainPage() {
    return (
        <div className="h-screen bg-[#09090b] text-gray-100 flex flex-col gap-6">

            <div className="flex gap-3">
                {["Grafig", "Kvitansiya", "Klient"].map((item) => (
                    <button
                        key={item}
                        className="bg-[#27272a] hover:bg-[#3f3f46] transition-colors text-sm font-medium px-4 py-2 rounded-lg border border-gray-800"
                    >
                        {item}
                    </button>
                ))}
            </div>

            <form className="w-full">
                <input
                    className="bg-[#18181b] w-full py-2 px-4 rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500 transition-all"
                    placeholder="Ism, raqam, shartnoma yoki PNFL..."
                />
            </form>

            <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#18181b]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#27272a] text-gray-300 text-sm uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3 font-semibold">№</th>
                        <th className="px-4 py-3 font-semibold">Mijoz</th>
                        <th className="px-4 py-3 font-semibold">Telefon</th>
                        <th className="px-4 py-3 font-semibold">Raqam</th>
                        <th className="px-4 py-3 font-semibold">Filial</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-[#27272a]/50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-400">1</td>
                        <td className="px-4 py-4 text-sm font-medium">Dilshodbek Mahammadjonov</td>
                        <td className="px-4 py-4 text-sm text-gray-400">+998 940250435</td>
                        <td className="px-4 py-4 text-sm font-mono text-blue-400">044400104</td>
                        <td className="px-4 py-4 text-sm text-gray-400">Fergana</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}