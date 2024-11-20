#version 300 es

// Input attributes
in vec3 a_position;
in vec3 a_normal;
in vec3 a_tangent;
in vec2 a_texture_coord;

// Transformation matrices
uniform mat4x4 u_m; // Model matrix
uniform mat4x4 u_v; // View matrix
uniform mat4x4 u_p; // Projection matrix

// Outputs to the fragment shader
out vec3 o_vertex_position_world;
out vec3 o_vertex_normal_world;
out vec3 o_tangent_world;
out vec3 o_bitangent_world;
out vec2 o_texture_coord;


void main() {
    // Transform vertex position to world space
    vec4 vertex_position_world = u_m * vec4(a_position, 1.0);

    // Transform normals and tangents to world space
    mat3 normal = transpose(inverse(mat3(u_m)));
    vec3 normal_world = normalize(normal * a_normal);
    vec3 tangent_world = normalize(mat3(u_m) * a_tangent);

    // Re-orthogonalize tangent using Gram-Schmidt process

    tangent_world = normalize(tangent_world - dot(tangent_world, normal_world) * normal_world);

    // Compute bitangent
    vec3 bitangent_world = cross(normal_world, tangent_world);

    // Pass data to fragment shader
    o_vertex_position_world = vertex_position_world.xyz;
    o_vertex_normal_world = normal_world;
    o_tangent_world = tangent_world;
    o_bitangent_world = bitangent_world;
    o_texture_coord = a_texture_coord;

    // Transform vertex position to clip space
    gl_Position = u_p * u_v * vertex_position_world;
}


