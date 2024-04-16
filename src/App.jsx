import React, { useState } from 'react';
import "./style.css"

function App() {
  const [subject, setSubject] = useState('');
  const [minAttendance, setMinAttendance] = useState(70);
  const [totalClasses, setTotalClasses] = useState(0);
  const [classesAttended, setClassesAttended] = useState(0);
  const [output, setOutput] = useState('');
  const [logs, setLogs] = useState('');

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleMinAttendanceChange = (event) => {
    setMinAttendance(parseInt(event.target.value));
  };

  const handleTotalClassesChange = (event) => {
    setTotalClasses(parseInt(event.target.value));
  };

  const handleClassesAttendedChange = (event) => {
    setClassesAttended(parseInt(event.target.value));
  };

  const calculateAttendance = () => {
    if (totalClasses <= 0 || classesAttended < 0 || isNaN(totalClasses) || isNaN(classesAttended)) {
      setOutput('<p class="error">Please enter valid positive values for total classes and classes attended.</p>');
    } else if (classesAttended > totalClasses) {
      setOutput('<p class="error">Classes attended cannot be greater than total classes.</p>');
    } else {
      const attendancePercentage = (classesAttended / totalClasses) * 100;
      let result;

      if (attendancePercentage >= minAttendance) {
        const daysAvailableToBunk = daysToBunk(classesAttended, totalClasses, minAttendance);
        result = daysToBunkText(daysAvailableToBunk, classesAttended, totalClasses);
      } else {
        const attendanceNeeded = reqAttendance(classesAttended, totalClasses, minAttendance);
        result = daysToAttendClassText(attendanceNeeded, classesAttended, totalClasses, minAttendance);
      }

      setOutput(`<p class="result">${result}</p>`);

      const data = { subject, minAttendance, totalClasses, classesAttended, attendancePercentage };
      setLogs((prevLogs) => prevLogs + `Subject: ${subject}\nPercentage Required: ${minAttendance}%\nTotal Classes: ${totalClasses}\nClasses Attended: ${classesAttended}\n${result}\n\n`);
      console.log(JSON.stringify(data));
    }
  };

  const downloadLogs = () => {
    downloadJSON(logs, 'logs.json');
  };

  const downloadJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reqAttendance = (present, total, percentage) => {
    return Math.ceil((percentage * total - 100 * present) / (100 - percentage));
  };

  const daysToBunk = (present, total, percentage) => {
    return Math.floor((100 * present - percentage * total) / percentage);
  };

  const daysToBunkText = (daysAvailableToBunk, present, total) =>
    `You can bunk for ${daysAvailableToBunk} more days.\nCurrent Attendance: ${present}/${total} = ${((present / total) * 100).toFixed(2)}%`;

  const daysToAttendClassText = (attendanceNeeded, present, total, percentage) =>
    `You need to attend ${attendanceNeeded} more classes to attain ${percentage}% attendance.\nCurrent Attendance: ${present}/${total} = ${((present / total) * 100).toFixed(2)}%`;

  return (
    <div>
      <div className="header">Attendance Calculator</div>
      <div className="container">
        <div className="calculator">
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" maxLength="20" placeholder="Enter Subject" value={subject} onChange={handleSubjectChange} required />
          <label htmlFor="minAttendance">Percentage Required:</label>
          <select id="minAttendance" value={minAttendance} onChange={handleMinAttendanceChange}>
            <option value="70">70%</option>
            <option value="75">75%</option>
            <option value="80">80%</option>
            <option value="85">85%</option>
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="100">100%</option>
          </select>
          <div>
            <label>Total Classes:</label>
            <input type="number" id="totalClasses" value={totalClasses} onChange={handleTotalClassesChange} />
          </div>
          <div>
            <label>Classes Attended:</label>
            <input type="number" id="classesAttended" value={classesAttended} onChange={handleClassesAttendedChange} />
          </div>
          <button onClick={calculateAttendance}>Calculate</button>
          <div dangerouslySetInnerHTML={{ __html: output }}></div>
          <div>
            <label htmlFor="logs">Logs:</label>
            <textarea id="logs" rows="4" readOnly value={logs}></textarea>
          </div>
        </div>
      </div>
      <div className="footer">
        <a href="index_0.html">How to Use?</a> | <a href="#" onClick={downloadLogs}>Download Logs</a>
      </div>
    </div>
  );
}

export default App;
