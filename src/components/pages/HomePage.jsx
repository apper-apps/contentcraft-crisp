import React from "react";
import ContentGenerator from "@/components/organisms/ContentGenerator";

const HomePage = ({ selectedBrand }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ContentGenerator selectedBrand={selectedBrand} />
    </div>
  );
};

export default HomePage;