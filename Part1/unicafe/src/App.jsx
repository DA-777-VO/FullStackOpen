import { useState } from 'react';

const Statistics = ({ good, neutral, bad }) => {
    const allFeedback = good + neutral + bad;
    const average =
        allFeedback > 0 ? (good * 1 + neutral * 0 + bad * -1) / allFeedback : 0;
    const positive = allFeedback > 0 ? (good * 100) / allFeedback : 0;

    if (allFeedback === 0) {
        return <p>No feedback given</p>;
    }

    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="all" value={allFeedback} />
                <StatisticLine text="average" value={average} />
                <StatisticLine text="positive" value={positive + ' %'} />
            </tbody>
        </table>
    );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticLine = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
);

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleGoodClick = () => {
        setGood(good + 1);
    };

    const handleNeutralClick = () => {
        setNeutral(neutral + 1);
    };

    const handleBadClick = () => {
        setBad(bad + 1);
    };

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGoodClick} text="good" />
            <Button onClick={handleNeutralClick} text="neutral" />
            <Button onClick={handleBadClick} text="bad" />
            <h2>statistics</h2>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

export default App;
