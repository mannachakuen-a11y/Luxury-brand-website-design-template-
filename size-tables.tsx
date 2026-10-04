import { CLOTHING_MEASURES, SHOE_MEASURES } from "@/lib/house";

export function SizeTables() {
  return (
    <div className="space-y-12 text-sm">
      <div>
        <p className="label text-taupe">Ready-to-wear and evening</p>
        <p className="mt-4 max-w-md leading-7 text-charcoal">
          French sizing. Measurements are body, in centimetres. If you fall between sizes, take the larger for coats and the smaller for column evening.
        </p>
        <table className="mt-6 w-full text-left">
          <thead className="label text-taupe">
            <tr>
              <th className="py-3 font-normal">Size</th>
              <th className="py-3 font-normal">Bust</th>
              <th className="py-3 font-normal">Waist</th>
              <th className="py-3 font-normal">Hip</th>
            </tr>
          </thead>
          <tbody>
            {CLOTHING_MEASURES.map((row) => (
              <tr key={row.size} className="border-t border-line">
                <td className="py-3">{row.size}</td>
                <td className="py-3">{row.bust}</td>
                <td className="py-3">{row.waist}</td>
                <td className="py-3">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p className="label text-taupe">Shoes</p>
        <p className="mt-4 leading-7 text-charcoal">European sizing. Foot length in centimetres. Both lasts fit true.</p>
        <table className="mt-6 w-full text-left">
          <thead className="label text-taupe">
            <tr>
              <th className="py-3 font-normal">Size</th>
              <th className="py-3 font-normal">Length</th>
            </tr>
          </thead>
          <tbody>
            {SHOE_MEASURES.map((row) => (
              <tr key={row.size} className="border-t border-line">
                <td className="py-3">{row.size}</td>
                <td className="py-3">{row.cm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
