import { useNavigate } from "react-router-dom";

export default function HospitalItemComponent(props) {

   // 실행할 구문
   let navigate = useNavigate();

   const item = props.item;

   return (
         <tr onClick={ () => { navigate('/hospital/${ item.id }');} }>
            <td>{ item.id }</td>
            <td>{ item.address }</td>
            <td>{ item.phone }</td>
            <td>{ item.id }</td>
            <td>{ item.id }</td>
         </tr>
   );
}
