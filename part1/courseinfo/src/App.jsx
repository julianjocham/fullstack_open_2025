
const Header = (props) => {
    console.log(props)
    return <h1>{props.course}</h1>
}

const Content = (props) => {
    return <div>
        {props.content.map((part) => {
            return <Part key={part.name} name={part.name} exercises={part.exercises}></Part>
        })}
    </div>
}

const Total = (props) => {
    const total = props.parts.map((part) => {return part.exercises}).reduce((a, b) => a + b, 0)
    return <p>{`Number of exercises ${total}`}</p>
}

const Part = (props) => {
    return <p key={props.name}>{props.name} {props.exercises}</p>
}


const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course.name}></Header>
            <Content content={course.parts}></Content>
            <Total parts={course.parts}></Total>
        </div>
    )
}

export default App