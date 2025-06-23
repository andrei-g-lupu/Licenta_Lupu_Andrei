from graphviz import Digraph

# Inițializare organigramă
org_chart = Digraph('Organigrama_Firma_Juridica', format='png', graph_attr={'rankdir': 'TB'})
org_chart.attr(compound='true', nodesep='0.5')

# Noduri principale
org_chart.node('MP', 'Managing Partner\n(Director General)', shape='box3d', style='filled', color='gold')
org_chart.node('ADM', 'Departamentul Administrativ\n(HR, Financiar, IT)', shape='box', style='rounded,filled', fillcolor='lightgrey')

# Departamente juridice
departamente = {
    'CONS': 'Departamentul\nConsultanță și\nContracte Comerciale',
    'LIT': 'Departamentul\nLitigii și Arbitraj',
    'HR': 'Departamentul\nDreptul Muncii\nși HR'
}

for key, label in departamente.items():
    org_chart.node(key, label, shape='box', style='filled,rounded', fillcolor='lightblue')

# Echipe pe departamente
for prefix in ['CONS', 'LIT', 'HR']:
    org_chart.node(f'{prefix}_S', 'Avocați Seniori', shape='ellipse')
    org_chart.node(f'{prefix}_J', 'Avocați Juniori', shape='ellipse')
    org_chart.node(f'{prefix}_P', 'Personal suport\n(paralegali, asistenți)', shape='ellipse', style='dashed')

# Legături ierarhice
org_chart.edges([('MP', 'ADM'), ('MP', 'CONS'), ('MP', 'LIT'), ('MP', 'HR')])

# Legături în interiorul departamentelor
for dept in departamente.keys():
    org_chart.edge(dept, f'{dept}_S')
    org_chart.edge(dept, f'{dept}_J')
    org_chart.edge(dept, f'{dept}_P')

# Salvare și afișare
org_chart.render('organigrama_firma_juridica', view=True)
print("Organigrama generată: organigrama_firma_juridica.png")