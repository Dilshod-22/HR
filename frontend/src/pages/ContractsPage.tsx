export default function ContractsPage() {
    const transactions = [
        {
            type: "PLAN",
            date: "01.02.2026",
            label: "Fevral oyi uchun asosiy to'lov",
            amount: "1,200,000",
            status: "pending",
        },
        {
            type: "RECEIPT",
            date: "05.02.2026",
            label: "Kvitansiya #KV-882 (Payme orqali)",
            amount: "500,000",
        },
        {
            type: "RECEIPT",
            date: "10.02.2026",
            label: "Kvitansiya #KV-901 (Naqd pul)",
            amount: "700,000",
        },
        {
            type: "PLAN",
            date: "01.03.2026",
            label: "Mart oyi uchun asosiy to'lov",
            amount: "1,200,000",
            status: "waiting",
        },
        {
            type: "RECEIPT",
            date: "02.03.2026",
            label: "Kvitansiya #KV-1023 (Terminal)",
            amount: "300,000",
        },
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-gray-200 p-6 font-sans">
            {/* Yuqori qism: Summary */}
            <div className="mb-8 flex justify-between items-end border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">To'lovlar Tarixi</h1>
                    <p className="text-gray-500 text-sm mt-1">Shartnoma: #CON-0444 • Dilshodbek M.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Umumiy Qarzdorlik</p>
                    <p className="text-3xl font-mono text-rose-500 font-bold">8,500,000 <span className="text-sm">UZS</span></p>
                </div>
            </div>

            {/* Timeline List */}
            <div className="max-w-4xl mx-auto flex flex-col gap-1">
                {transactions.map((item, index) => {
                    const isPlan = item.type === "PLAN";

                    return (
                        <div key={index} className={`relative flex items-center group`}>
                            {/* Chap tomondagi chiziq va nuqta */}
                            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-800 group-last:h-1/2"></div>

                            <div className="flex items-center w-full ml-10 py-3 leading-none">
                                {/* Nuqta (Indicator) */}
                                <div className={`absolute left-[13px] w-2.5 h-2.5 rounded-full border-2 ${
                                    isPlan ? 'bg-blue-500 border-blue-900 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-600 border-[#09090b]'
                                }`}></div>

                                {/* Asosiy blok */}
                                <div className={`flex w-full items-center justify-between p-4 rounded-xl border transition-all ${
                                    isPlan
                                        ? 'bg-[#18181b] border-gray-700 shadow-md translate-x-0'
                                        : 'bg-transparent border-transparent opacity-80 hover:opacity-100 hover:bg-[#18181b]/30'
                                }`}>
                                    <div className="flex gap-6 items-center">
                    <span className={`text-xs font-mono w-20 ${isPlan ? 'text-gray-300' : 'text-gray-500'}`}>
                      {item.date}
                    </span>
                                        <div>
                                            <p className={`text-sm ${isPlan ? 'font-bold text-white' : 'font-medium text-gray-400 italic'}`}>
                                                {item.label}
                                            </p>
                                            {isPlan && (
                                                <span className="text-[10px] text-blue-400 uppercase tracking-tighter">Grafik bo'yicha</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className={`text-sm font-mono ${isPlan ? 'text-gray-200' : 'text-emerald-500'}`}>
                                            {isPlan ? item.amount : `+${item.amount}`}
                                        </p>
                                        {!isPlan && (
                                            <span className="text-[10px] text-gray-600 uppercase">To'lov amalga oshdi</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer statistics */}
            <div className="mt-10 grid grid-cols-2 gap-4 max-w-4xl mx-auto border-t border-gray-800 pt-6">
                <div className="bg-[#18181b]/50 p-4 rounded-xl border border-gray-800/50">
                    <p className="text-xs text-gray-500">Jami to'langan</p>
                    <p className="text-xl font-mono text-emerald-400">2,400,000</p>
                </div>
                <div className="bg-[#18181b]/50 p-4 rounded-xl border border-gray-800/50">
                    <p className="text-xs text-gray-500">Reja bo'yicha to'lov</p>
                    <p className="text-xl font-mono text-blue-400">1,200,000</p>
                </div>
            </div>
        </div>
    );
}
