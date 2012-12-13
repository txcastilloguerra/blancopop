<?php
$valido = true;
if(isset($_POST['email'])){	
	if (!ereg("^([a-zA-Z0-9\._]+)\@([a-zA-Z0-9\.-]+)\.([a-zA-Z]{2,4})",$_POST['email'])){
		$valido = false;
	}	
}else{
	$valido = false;
}
if($valido){

$to = "comentarios@blancopop.com"; 
	$subject = "Alguien se registro";
	//$name_field = $_POST['nombre'];
	$name_field = "Nuevo usuario BPOP V2.0b";
	$email_field = $_POST['email'];
	//$sexo  = $_POST['sexo'];
	$sexo = "indistinto";
	//$edad_field = $_POST['edad'];
	$edad_field = "indistinto";
	//$edocivil = $_POST['edocivil'];
	$edocivil = "indistinto";
	//$estado_field = $_POST['estado'];
	$estado_field = "indistinto";
	//$ciudad_field = $_POST['ciudad'];
	$ciudad_field = "indistinto";
	//$pais_field = $_POST['pais'];
	$pais_field = "indistinto";
	//$message = $_POST['comentario'];
	$message = "vacio";

	


	foreach($_POST['check'] as $value) {
		$check_msg .= "preferencias: $value\n";
	}
	
	$body = "Nombre $name_field\n E-Mail $email_field\n sexo $sexo\n edad $edad_field\n edocivil  $edocivil\n estado $estado_field\n ciudad  $ciudad_field\n pais $pais_field\n $check_msg\Comentario\n $message\n";

	echo "<h3>HAS QUEDADO REGISTRADO EN BLANCOPOP.</h3>";
	echo '<a href="http://www.blancopop.com/drupal">Haz click aqui para regresar</a>';
	mail($to, $subject, $body);







}else{
		echo "<h3>Sus datos contienen errores.</h3>";
		echo '<a href="http://www.blancopop.com/drupal">Haz click aqui para intentarlo de nuevo</a>';
	}
?>


