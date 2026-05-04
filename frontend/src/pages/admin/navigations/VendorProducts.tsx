import { useState } from "react";
import AddVendorModal from "./AddVendorModal";

const VendorProducts = ({ fetchVendorsList }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Add Vendor</button>
      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onRefresh={fetchVendorsList}
      />
    </div>
  );
};

export default VendorProducts;
