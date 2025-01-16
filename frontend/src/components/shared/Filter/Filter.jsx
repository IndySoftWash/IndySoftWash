import { useState } from "react";

const Filter = ({ applyFilters, type }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  let filters = [];

  if (type === "activeOverview") {
    filters = [
      { id: "az", label: "A-Z", group: "Name Sorting" },
      { id: "za", label: "Z-A", group: "Name Sorting" },
      { id: "dateAsc", label: "Date Ascending", group: "Date Sorting" },
      { id: "dateDesc", label: "Date Descending", group: "Date Sorting" },
    ];
  } else if (type === "proposal") {
    filters = [
      { id: "az", label: "A-Z", group: "Name Sorting" },
      { id: "za", label: "Z-A", group: "Name Sorting" },
      { id: "dateAsc", label: "Date Ascending", group: "Date Sorting" },
      { id: "dateDesc", label: "Date Descending", group: "Date Sorting" },
      { id: "active", label: "Active Proposals", group: "Status Filters" },
      { id: "not accepted", label: "Not Accepted Proposals", group: "Status Filters" },
      { id: "sent", label: "Sent Proposals", group: "Status Filters" },
      { id: "created", label: "Created Proposals", group: "Status Filters" },
      { id: "past", label: "Past Proposals", group: "Status Filters" },
    ];
  } else if(type === "customer") {
    filters = [
      { id: "az", label: "A-Z", group: "Name Sorting" },
      { id: "za", label: "Z-A", group: "Name Sorting" },
      { id: "dateAsc", label: "Date Ascending", group: "Date Sorting" },
      { id: "dateDesc", label: "Date Descending", group: "Date Sorting" },
      { id: "lead", label: "Lead", group: "status" },
      { id: "current customer", label: "Current Customer", group: "status" },
      { id: "past customer", label: "Past Customer", group: "status" },
    ];
  }

  const toggleFilter = (filterId) => {
    const selectedFilter = filters.find((filter) => filter.id === filterId);
    const filterGroup = selectedFilter.group;

    setSelectedFilters((prev) => {
      // Remove other filters in the same group
      const filtered = prev.filter(
        (id) => filters.find((filter) => filter.id === id)?.group !== filterGroup
      );

      // Toggle the current filter
      if (prev.includes(filterId)) {
        return filtered; // Deselect the current filter
      } else {
        return [...filtered, filterId]; // Select the current filter
      }
    });
  };

  const handleApply = () => {
    applyFilters(selectedFilters);
  };

  // Group filters by the group property
  const groupedFilters = filters.reduce((acc, filter) => {
    acc[filter.group] = acc[filter.group] || [];
    acc[filter.group].push(filter);
    return acc;
  }, {});

  return (
    <>
      <div
        className="modal fade"
        id="filter"
        tabIndex="-1"
        aria-labelledby="filterModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content box-cs">
            <div className="modal-header">
              <h5 className="modal-title font-1 fw-700" id="filterModalLabel">
                Apply Filters
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {Object.entries(groupedFilters).map(([group, groupFilters]) => (
                <div key={group}>
                  <h6 className="mb-2 mt-3 font-1 fw-700 font-size-16">{group}</h6>
                  {groupFilters.map((filter) => (
                    <div key={filter.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={filter.id}
                        checked={selectedFilters.includes(filter.id)}
                        onChange={() => toggleFilter(filter.id)}
                      />
                      <label className="form-check-label font-1 font-size-14" htmlFor={filter.id}>
                        {filter.label}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="filter-btn bg-theme-7"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="filter-btn bg-theme-1"
                onClick={handleApply}
                data-bs-dismiss="modal"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
