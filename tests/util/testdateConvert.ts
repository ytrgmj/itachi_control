import {DateUtil} from '@dt/itachi_core'
import dateConvert from '../../src/util/dateConvert'

test('dateconvert', function () {
    let obj = {
        aaa:1,
        bb:"aaa",
        ccc:new Date(),
        ddd:[
            DateUtil.afterDay(new Date(),1),
            [
                DateUtil.afterDay(new Date(),2),
                DateUtil.afterDay(new Date(),3)
            ],
            {
                eee:DateUtil.afterDay(new Date(),4),
                ff:'string'
            }

        ],
        fff:{
            ggg:123,
            hhh:[
                DateUtil.afterDay(new Date(),5),
                [DateUtil.afterDay(new Date(),6),{iii:DateUtil.afterDay(new Date(),7)}],
                {
                    jjj:new Date(),
                    lll:123
                }
            ]
        }

    }
    console.log(JSON.stringify(dateConvert(obj),null,4));
    
});