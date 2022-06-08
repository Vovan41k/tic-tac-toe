let  num = 5
num = 6

const numbers = []
numbers.push(5)


const person = {
    name:'John',
    age:200,

}
person.age = 100

const modify = (item)=>{
    item.age = 7
}
modify(person)
console.log(person)