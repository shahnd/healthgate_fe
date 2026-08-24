import { useNavigate } from "react-router-dom";

export default function HospitalItemComponent(props) {

   // 실행할 구문
   let navigate = useNavigate();

   const item = props.item;

   return (
         <tr onClick={ () => { navigate('/hospitals/${ item.hospitalId }');} }>
            <td>{ item.hospitalId }</td>
            <td>{ item.name }</td>
            <td>{ item.address }</td>
            <td>{ item.isGeneralExamAvailable }</td>
            <td>{ item.isStomachCancerExamAvailable }</td>
            <td>{ item.isColonCancerExamAvailable }</td>
            <td>{ item.isLiverCancerExamAvailable }</td>
            <td>{ item.isLungCancerExamAvailable}</td>
         </tr>
   );
}
