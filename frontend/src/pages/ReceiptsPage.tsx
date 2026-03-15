import { FiEdit2 } from 'react-icons/fi'; // Feather Icons to'plamidan
import { MdDeleteOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function ReceiptsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kvitansiyalar</h1>
        <Link to={ROUTES.RECEIPT_NEW} className="btn-primary">+ Create</Link>
      </div>
    
      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Status</th>
            <th>Sana</th>
            <th>Nomer</th>
            <th>Shartnoma raqami</th>
            <th>Client</th>
            <th>Payment type</th>
            <th>Summa</th>
            <th>Filial</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>      
          <tr>
            <td className="text-[12px]">AutoPay</td>
            <td className="text-[12px] text-green-500">Compited</td>
            <td className="text-[12px]">2026-02-03</td>
            <td className="text-[12px]">0040473841</td>
            <td className="text-[12px]">02514601</td>
            <td className="text-[12px]">Mahammadjonov Dilshodjon</td>
            <td className="text-[12px]">Card</td>
            <td className="text-lime-600 text-[12px]">5000 so‘m</td>
            <td className="text-[12px]">Toshkent</td>
            <td>
              <div className="flex item-center justify-center gap-3">
                <button className="text-blue-600 rounded-lg transition-colors" title="Tahrirlash"><FiEdit2 size={18}/></button>
                <button className="text-red-600 rounded-lg transition-colors" title="O'chirish"><MdDeleteOutline size={18}/></button>   
              </div>  
            </td>
          </tr>
          <tr>
            <td className="text-[12px]">Kassa</td>
            <td className="text-[12px] text-yellow-500">Process</td>
            <td className="text-[12px]">2026-02-03</td>
            <td className="text-[12px]">0040473841</td>
            <td className="text-[12px]">02514601</td>
            <td className="text-[12px]">Mahammadjonov Dilshodjon</td>
            <td className="text-[12px]">Cash</td>
            <td className="text-lime-600 text-[12px]">5000 so‘m</td>
            <td className="text-[12px]">Toshkent</td>
            <td>
              <div className="flex item-center justify-center gap-3">
                <button className="text-blue-600 rounded-lg transition-colors" title="Tahrirlash"><FiEdit2 size={18}/></button>
                <button className="text-red-600 rounded-lg transition-colors" title="O'chirish"><MdDeleteOutline size={18}/></button>  
              </div>  
            </td>
          </tr>
          <tr>
            <td className="text-[12px]">Kassa</td>
            <td className="text-[12px] text-red-500">Cancel</td>
            <td className="text-[12px]">2026-02-03</td>
            <td className="text-[12px]">0040473841</td>
            <td className="text-[12px]">02514601</td>
            <td className="text-[12px]">Mahammadjonov Dilshodjon</td>
            <td className="text-[12px]">Cash</td>
            <td className="text-lime-600 text-[12px]">5000 so‘m</td>
            <td className="text-[12px]">Toshkent</td>
            <td>
              <div className="flex item-center justify-center gap-3">
                <button className="text-blue-600 rounded-lg transition-colors" title="Tahrirlash"><FiEdit2 size={18}/></button>
                <button className="text-red-600 rounded-lg transition-colors" title="O'chirish"><MdDeleteOutline size={18}/></button>  
              </div>  
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
