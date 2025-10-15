import React, { useState, useCallback } from "react";
import Customers from "./Customers";
import AddCustomer from "./AddCustomer";
import SimpleBar from "simplebar-react";

const CustomerManagementView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCustomer = useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleCustomerSuccess = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleCustomerCancel = useCallback(() => {
    setShowAddForm(false);
  }, []);

  if (showAddForm) {
    return (
      <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex-1 flex flex-col overflow-hidden border border-gray-100 dark:border-gray-400">
          <SimpleBar
            className="flex-1"
            style={{ height: "calc(100vh - 300px)" }}
          >
            <div className="p-6">
              <AddCustomer
                handleSuccess={handleCustomerSuccess}
                handleCancel={handleCustomerCancel}
              />
            </div>
          </SimpleBar>
        </div>
      </div>
    );
  }

  return <Customers onAddCustomer={handleAddCustomer} />;
};

export default CustomerManagementView;
