
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


const Course = (props) => {
    return <div>
        <Header course={props.course.name}></Header>
        <Content content={props.course.parts}></Content>
        <Total parts={props.course.parts}></Total>
    </div>
}

export default Course