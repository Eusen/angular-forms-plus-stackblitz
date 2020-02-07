import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilderPlus, FormGroupPlus} from '../services/form-builder';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent  {
  formGroup1: FormGroupPlus;
  formGroup2: FormGroupPlus;
  students: any[];

  constructor(private fbp: FormBuilderPlus) {
    // 1. 创建一个普通的 FormGroup
    this.formGroup1 = this.fbp.group(
        // 第一个参数为结构及默认值
        {
          name: 'Default Name', // 可以直接写一个默认值
          address: null, // 如果没有默认值，可以填 null 或者 ''
        },
        // 第二个参数定义校验方式
        {
          // withoutParams 意为无参数校验，主要是针对 Validators 进行的封装
          // 因为 Validators 分两种，一种是不用填参数的，一种是需要填参数的
          withoutParams: [
            // key 就是 Validators 的 key
            // fields 是所有必填的字段
            {key: 'required', fields: ['name', 'address']}
          ]
        });

    // 2. 创建一个带 Array 的 FormGroup
    this.formGroup2 = this.fbp.group({
      name: 'Class 1',
      // 如果不带验证，可以直接写一个数组，唯一要求就是每个对象的字段必须都一样
      students: this.fbp.array([
        {name: 'Gucci', age: 18},
        {name: 'Prada', age: 11},
      ], {
        withoutParams: [{key: 'required', fields: ['name']}],
        requireParams: [{key: 'min', params: 10, fields: ['age']}]
      })
    }, {
      withoutParams: [{key: 'required', fields: ['name']}],
    });

    // 不用form里的值遍历，是因为每次输入都会重新渲染，使input丢失焦点
    this.formGroup2.getArray('students').changed.subscribe(students => {
      this.students = students;
    })
  }

  group(type) {
    return this[`formGroup${type}`];
  }

  submit(type) {
    // 调用 hasError() 后，Group和Array对象会自动触发 error 检测
    // Control一般会在html中用做异常判断，所以不会自动触发
    if (!this[`formGroup${type}`].hasError()) {
      console.log(`Submit${type}`, this[`formGroup${type}`].value)
    }
  }

  studentMoveUp(index) {
    const studentsFormArrayPlus = this.formGroup2.getArray('students');
    studentsFormArrayPlus.moveUp(index);
  }
  studentMoveDown(index) {
    const studentsFormArrayPlus = this.formGroup2.getArray('students');
    studentsFormArrayPlus.moveDown(index);
  }
  studentRemove(i) {
    const studentsFormArrayPlus = this.formGroup2.getArray('students');
    studentsFormArrayPlus.remove(i);
  }
  studentAppend() {
    const studentsFormArrayPlus = this.formGroup2.getArray('students');
    studentsFormArrayPlus.push({name: null, age: null});
  }
}
