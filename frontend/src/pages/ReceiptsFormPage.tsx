import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';


export default function ReceiptsPage() {
  return (
    <div>
      <h1 className="page-title">Create Kvitansiyalar</h1>
        
      
      <form action="POST" className='mt-4'>

        {/* Client Information */}
        <div className="grid gap-6 grid-cols-2 grid-rows-2 mb-6">
          <label className="form-label">
            Client
            <input type="text" placeholder="Client" className="form-input" />
          </label>
          <label className="form-label">
            Shartnoma
            <input type="text" placeholder="Shartnoma" className="form-input" />
          </label>
          <label className="form-label">
            Javobgar
            <input type="text" placeholder="Javobgar" className="form-input" />
          </label>
          <label className="form-label">
            Branch
            <input type="text" placeholder="Branch" className="form-input" />
          </label>
        </div>

        {/* Payment Details */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
            Payment Details
          </h2>
          <div className="grid gap-6 grid-cols-2">
            <label className="form-label">
              Type
              <select name="type" id="type" className="form-select">
                <option value="">Select Type</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </label>
            <label className="form-label">
              Summa
              <input type="number" placeholder="Summa" className="form-input" />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button className="btn-cancel">
            <Link to={ROUTES.RECEIPTS}>
              Cancel
            </Link>
          </button>
          <button type="submit" className="btn-primary">
            Create
          </button>
        </div>

      </form>
    </div>
  );
}