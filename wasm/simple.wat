(module
  (type $t0 (func (param i32)))
  (type $t1 (func))
  (import "imports" "imported_func" (func $imports.imported_func (type $t0)))
  (func $exported_func (type $t1)
    i32.const 42
    call $imports.imported_func)
  (export "exported_func" (func $exported_func)))
