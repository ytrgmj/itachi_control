import underlineHump from '../../src/util/underlineHump'

test('测试驼峰转下划线', function () {
    const undData ={
        "brand_id":600059,
        "array":[
            {
                type:'add',
                product_menu_id:1647,
                store_id:800220,
                channel:'mobile',
                effect_time:'2020-09-01',
                product_time_id:21,
                
            },
            {
                product_menu_id:1647,
                type:'add',
                store_id:800271,
                channel:'mobile',
                effect_time:'2020-09-01',
                product_time_id:21,
            }
    
        ]
    }
    const humpData = underlineHump(undData)
    console.log(JSON.stringify(humpData,null,4));
    

});