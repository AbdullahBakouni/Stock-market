"use client";

import { useUIStore } from "@/lib/store/ui-srore";
import { Button } from "./ui/button";

const AddStockButton = () => {
  const openSearch = useUIStore((state) => state.openSearch);
  return (
    <>
      <Button className="addstock-btn" onClick={openSearch}>
        Add Stock
      </Button>
    </>
  );
};

export default AddStockButton;
