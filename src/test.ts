import moment from 'moment'

const trigger = moment().format('YYYY-MM-DD') + " 08:00:00"
console.log(moment(trigger).format('x'))