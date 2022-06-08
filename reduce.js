const arr = [1, 5, 8, 3,9, 10]
console.log(arr.reduce((acc, num)=>{
    return acc+num
},0))
console.log(arr.reduce((acc, num)=>{
    return acc*num
},1))
console.log(arr.reduce((acc, num)=>{
    if(num%2===0){
        return acc*num
    }
    return acc
},1))
console.log(arr.reduce((acc, num)=>{
    if(num%2===0){
       return acc+num
    }
    else{
    return acc-num}
},0))
console.log(arr.reduce((acc, num)=>{
    return {
        sum:acc.sum+num,
        multiple:acc.multiple*num,
        count:acc.count+1,
        odd:acc.odd+(num%2===1?1:0),
        even:acc.even+(num%2===0?1:0),
        avg:(acc.sum+num)/(acc.count+1)

    }
},{
    sum:0,
    multiple:1,
    count:0,
    odd:0,
    even:0,
    avg:0
}))