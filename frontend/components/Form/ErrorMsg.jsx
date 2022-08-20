import { ErrorMessage } from '@hookform/error-message';
import { PropTypes } from 'prop-types';

function ErrorMsg(props) {
  const { errors, name } = props;

  /* Define state / hook */

  /* Custom Data Object for render or other usages */

  /* Render control function / logic */

  /* Data Change Listeners - useEffect/useMemo/useCallback */

  /* Styling */

  /* Render */
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p className="text-red-500 mt-1 text-sm">{message}</p>
      )}
    />
  );
}

ErrorMsg.propTypes = {
  errors: PropTypes.object,
  name: PropTypes.string,
};

export default ErrorMsg;
