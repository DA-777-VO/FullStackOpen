const Course = ({courses}) => {

    // const test = courses.map(course => course)
    // console.log(test)
    return(
        <div>
            <h1>Web development curriculum</h1>
            {courses.map((course) => (
                <div key={course.id}>
                    <Header name={course.name} />
                    <Content parts={course.parts} />
                    <Total parts={course.parts} />
                </div>
            ))}
        </div>
    )
}

const Header = ({name}) => {
    return (
        <div>
            <h2>{name}</h2>
        </div>
    );
};

const Forwarder = (props) => {
    return (
        <div>
            <p>
                {props.part.name} {props.part.exercises}
            </p>
        </div>
    );
};

const Content = ({parts}) => {
    return (
        <div>
            {parts.map(part => <Forwarder key={part.id} part={part}/>)}
        </div>
    );
};

const Total = ({parts}) => {

    const sum = parts.reduce((total, part) => total + part.exercises, 0);
    return <b>total of {sum} exercises </b>
}

export default Course;