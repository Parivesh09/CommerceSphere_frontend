import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export default function CompareProductsPage() {
  const navigate = useNavigate();

  const productsToCompare = [
    {
      id: 'prod-1',
      title: 'Matrix Point 2.0 Terminal',
      price: 1299.00,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=400&q=80',
      specs: {
        Display: '10.1" OLED Touch Display',
        Connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
        Battery: '12 Hours Continuous Operating',
        Encryption: 'Hardware Level AES-256',
        Warranty: '3 Years Enterprise SLA',
      },
    },
    {
      id: 'prod-2',
      title: 'Quantum Scan Pro',
      price: 849.00,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
      specs: {
        Display: 'Integrated Laser HUD',
        Connectivity: 'Wi-Fi 6E, Zigbee IoT',
        Battery: '24 Hours Standby / 10 Hours Active',
        Encryption: 'FIPS 140-2 Validated',
        Warranty: '2 Years Replacement',
      },
    },
    {
      id: 'prod-4',
      title: 'Core Tablet Gen 3',
      price: 1199.00,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
      specs: {
        Display: '11.5" Retina IPS 120Hz',
        Connectivity: '5G, Wi-Fi 6E',
        Battery: '16 Hours Operating',
        Encryption: 'Biometric Secure Enclave',
        Warranty: '3 Years Enterprise SLA',
      },
    },
  ];

  const specKeys = ['Display', 'Connectivity', 'Battery', 'Encryption', 'Warranty'];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="text-3xl font-bold text-[#0b1c30] mb-2">Compare Products</h1>
        <p className="text-sm text-[#464555] mb-8">Side-by-side technical specification matrix for enterprise evaluation.</p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left w-48 bg-[#eff4ff] rounded-tl-2xl font-bold text-xs uppercase text-[#464555]">
                  Product Overview
                </th>
                {productsToCompare.map((prod) => (
                  <th key={prod.id} className="p-6 bg-white border border-slate-100 text-center w-72">
                    <div className="space-y-3">
                      <img src={prod.image} alt="" className="w-32 h-32 object-cover rounded-xl mx-auto shadow-sm" />
                      <h3 className="font-bold text-sm text-[#0b1c30]">{prod.title}</h3>
                      <p className="text-xl font-bold text-[#3525cd]">${prod.price.toLocaleString()}</p>
                      <button
                        onClick={() => navigate(`/products/${prod.id}`)}
                        className="px-4 py-2 bg-[#0b1c30] text-white text-xs font-bold rounded-xl hover:bg-[#3525cd] transition-colors w-full"
                      >
                        View Product
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {specKeys.map((key) => (
                <tr key={key} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-xs uppercase text-[#464555] bg-[#eff4ff]">{key}</td>
                  {productsToCompare.map((prod) => (
                    <td key={prod.id} className="p-4 text-center text-sm font-medium text-[#0b1c30] bg-white border border-slate-100">
                      {prod.specs[key as keyof typeof prod.specs]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
