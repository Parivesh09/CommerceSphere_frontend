import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen page-bg text-on-surface pt-28 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Compare Products</h1>
        <p className="text-sm text-on-surface-variant mb-4">Side-by-side technical specification matrix for enterprise evaluation.</p>
        <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mb-8" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left w-48 bg-surface-container-low rounded-tl-2xl font-bold text-xs uppercase text-on-surface-variant">
                  Product Overview
                </th>
                {productsToCompare.map((prod) => (
                  <th key={prod.id} className="p-6 bg-surface-container-lowest border border-outline-variant text-center w-72">
                    <div className="space-y-3">
                      <img src={prod.image} alt="" className="w-32 h-32 object-cover rounded-xl mx-auto shadow-sm" />
                      <h3 className="font-bold text-sm text-on-surface">{prod.title}</h3>
                      <p className="text-xl font-bold text-primary">${prod.price.toLocaleString()}</p>
                      <button
                        onClick={() => navigate(`/products/${prod.id}`)}
                        className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-glow hover:brightness-110 transition-colors w-full"
                      >
                        View Product
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {specKeys.map((key) => (
                <tr key={key} className="hover:bg-surface-container-high">
                  <td className="p-4 font-bold text-xs uppercase text-on-surface-variant bg-surface-container-low">{key}</td>
                  {productsToCompare.map((prod) => (
                    <td key={prod.id} className="p-4 text-center text-sm font-medium text-on-surface bg-surface-container-lowest border border-outline-variant">
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
