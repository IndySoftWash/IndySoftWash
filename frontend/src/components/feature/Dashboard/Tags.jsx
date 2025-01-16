import { NavLink } from 'react-router-dom'

const Tags = ({ customerData, proposalData }) => {
  // Count draft and active proposals
  const proposalStatusCount = proposalData.reduce(
    (acc, proposal) => {
      if (proposal.status?.type !== 'active') {
        acc.draft += 1;
      } else if (proposal.status?.type === 'active') {
        acc.active += 1;
      }
      return acc;
    },
    { draft: 0, active: 0 } // Initial counts for both status types
  );

  return (
    <>
      <div className="dashboard-tags-layout">
        <NavLink to={'/customer-list'} className="tag-card txt-deco-none bg-theme-1">
          <h4 className="font-2">Number Of Customers</h4>
          <div className="tag-circle bg-theme-4">
            <span className="font-2 font-size-35">{customerData?.length}</span>
          </div>
        </NavLink>
        <NavLink to={'/proposal'} className="tag-card txt-deco-none bg-theme-2">
          <h4 className="font-2">Number of Pending Proposals</h4>
          <div className="tag-circle bg-theme-5">
            <span className="font-2 font-size-35">
              {proposalStatusCount.draft}
            </span>
          </div>
        </NavLink>
        <NavLink to={'/active-overview'} className="tag-card txt-deco-none bg-theme-3">
          <h4 className="font-2">Number Of Active Proposals</h4>
          <div className="tag-circle bg-theme-6">
            <span className="font-2 font-size-35">
              {proposalStatusCount.active}
            </span>
          </div>
        </NavLink>
      </div>
    </>
  );
};

export default Tags;
