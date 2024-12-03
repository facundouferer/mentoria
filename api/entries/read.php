<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

// Inicializar conexión
$database = new Database();
$db = $database->getConnection();

// Obtener parámetros de la URL
$categoria = isset($_GET['categoria']) ? $_GET['categoria'] : null;

try {
    // Preparar la consulta
    $query = "SELECT * FROM entries";
    if ($categoria) {
        $query .= " WHERE categoria = :categoria";
    }
    
    $stmt = $db->prepare($query);

    // Bind del parámetro si existe
    if ($categoria) {
        $stmt->bindParam(":categoria", $categoria);
    }

    $stmt->execute();
    
    // Verificar si hay resultados
    if($stmt->rowCount() > 0) {
        $entries_arr = array();
        
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $entry_item = array(
                "id" => $id,
                "titulo" => $titulo,
                "bajada" => $bajada,
                "categoria" => $categoria,
                "categoria_y_tema" => $categoria_y_tema,
                "desarrollo" => $desarrollo,
                "img_prompt" => $img_prompt,
                "img_remota" => $img_remota,
                "img_local" => $img_local,
                "preguntas" => $preguntas,
                "created" => $created,
                "modified" => $modified
            );
            
            array_push($entries_arr, $entry_item);
        }
        
        http_response_code(200);
        echo json_encode($entries_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("mensaje" => "No se encontraron entradas."));
    }
} catch(PDOException $e) {
    http_response_code(503);
    echo json_encode(array("mensaje" => "Error en la consulta: " . $e->getMessage()));
}

$db = null;
?> 