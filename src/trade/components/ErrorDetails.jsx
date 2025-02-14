import React from 'react';
import PropTypes from 'prop-types';
import { convertBigDecimal } from '../utils/utils';

const ErrorDetails = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mt-3">
      <h5>Error Details</h5>
      <table className="table table-bordered">
        <tbody>
          {Object.entries(error)
            .filter(([key]) => key !== 'legs') // Exclude legs for separate handling
            .map(([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td>{value?.toString()}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {error.legs && error.legs.length > 0 && (
        <>
          <h5>Legs</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                {Object.keys(error.legs[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {error.legs.map((leg, index) => (
                <tr key={index}>
                  {Object.entries(leg).map(([key, value]) => {
                    const formattedValue =
                      typeof value === 'object' && value !== null
                        ? convertBigDecimal(value).toFixed(5)
                        : value?.toString();

                    return <td key={key}>{formattedValue}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

ErrorDetails.propTypes = {
  error: PropTypes.object,
};

export default ErrorDetails;
