import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/** *
 *  根据id根据部门  接口是根据restful的规则设计的
 * 同样的地址 不同的方法 执行不同的业务:删除 delete 新增 post 修改put 获取 get
 * **/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/**
 *  根据id根据部门  接口是根据restful的规则设计的
 * 同样的地址 不同的方法 执行不同的业务:删除 delete 新增 post 修改put 获取 get
 * **/
export function addDepartments(data) {
  return request({
    url: ' /company/department',
    method: 'post',
    data // axios的body参数data
  })
}

/**
 * 获取某个部门的详情
 */
export function getDepartmentDetail(id) {
  return request({
    url: ` /company/department/${id}`
  })
}

/**
 * 保存编辑的数据
 * 修改：put类型
 * ***/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
