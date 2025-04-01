import PropTypes from "prop-types";

const ErrorTooltip = ({ message, visible }) => {
  return (
    visible && (
      <div className="error-tooltip">
        <span className="error-message">{message}</span>
      </div>
    )
  );
};

ErrorTooltip.propTypes = {
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ErrorTooltip;
