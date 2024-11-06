$flowContext.wo.operations.workstation.(["name","=", id])
(
    $f := [["name", ]]
    $encodeUrl(http://localhost:8080/api/resource/Workstation?or_filter)
)

alter table workstation drop constraint workstation_workstation_type_id_fkey;
 alter table operation drop constraint operation_operator_type_id_fkey;
alter table run_operation drop constraint run_operation_operator_type_id_fkey;

# css
```css

	  0px 0px 5px rgba(0, 0, 0, 0.035),
	  0px 0px 40px rgba(0, 0, 0, 0.07)
	;
```
