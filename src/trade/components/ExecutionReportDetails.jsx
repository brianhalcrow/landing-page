import React from 'react';
import PropTypes from 'prop-types';
import { convertBigDecimal } from '../utils/utils';

const ExecutionReportDetails = ({ executionReport }) => {
  if (!executionReport) return null;

  return (
    <div className="mt-3">
      <h5>Execution Report Details</h5>
      <table className="table table-bordered">
        <tbody>
          {Object.entries(executionReport)
            .filter(([key]) => key !== 'legs')
            .map(([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td>{value?.toString()}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {executionReport.legs && executionReport.legs.length > 0 && (
        <>
          <h5>Legs</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                {Object.keys(executionReport.legs[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {executionReport.legs.map((leg, index) => (
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

ExecutionReportDetails.propTypes = {
  executionReport: PropTypes.object,
};

export default ExecutionReportDetails;
