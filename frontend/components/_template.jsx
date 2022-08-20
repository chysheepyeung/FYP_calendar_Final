import PropTypes from 'prop-types';

ComponentTemplate.propTypes = {
  text: PropTypes.string.isRequired,
};

function ComponentTemplate(props) {
  /* Define state / hook */
  const { text } = props;

  /* Custom Data Object for render or other usages */

  /* Render control function / logic */

  /* Data Change Listeners - useEffect/useMemo/useCallback */

  /* Styling */

  /* Render */
  return <h1 className="text-5xl">{text}</h1>;
}

export default ComponentTemplate;
