// 반품코드, 이유 조회
const getReturn =
`SELECT return_code,
		 return_reason
FROM return_code`;






module.exports ={
    getReturn,
}