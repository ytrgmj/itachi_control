import humpUnderline from '../../src/util/humpUnderline'

test('测试驼峰转下划线', function () {
    const humpData = {
        "brandId": "12233",
        "xxList": [
            {
                "storeId": 123
            },
            {
                "storeId": 456
            }
        ],
        "uuuList": {
            "mmmMmm": "mmmMmm",
            "aaaKkk": [
                1,
                2,
                3
            ],
            "bbbBbb": [
                {
                    "cccCcc": 1,
                    "dddDddd": 2
                },
                {
                    "cccCcc": 3,
                    "dddDddd": 3
                }
            ]
        }
    }
    const undData = humpUnderline(humpData)
    console.log(JSON.stringify(undData));
    const test1 = [{aBccc:1,ccDsd:{
        aGjj: 1,udJl:[1,2,3],ssd: 'wwDwdiw'
    }}]
    console.log(JSON.stringify(humpUnderline(test1)));
});